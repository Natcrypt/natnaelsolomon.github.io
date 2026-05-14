import axios from 'axios';
import { ethers } from 'ethers';

const BASE = process.env.SODEX_TESTNET_REST || 'https://testnet-gw.sodex.dev/api/v1';
const CHAIN_ID = parseInt(process.env.SODEX_CHAIN_ID) || 138565; // testnet

const client = axios.create({ baseURL: BASE, timeout: 10000 });

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.message || err.message;
    const error = new Error(`SoDEX API error: ${msg}`);
    error.status = err.response?.status || 500;
    throw error;
  }
);

// ─── EIP-712 Signing helpers ─────────────────────────────────

const EIP712_DOMAIN_SPOT = {
  name: 'spot',
  version: '1',
  chainId: CHAIN_ID,
  verifyingContract: '0x0000000000000000000000000000000000000000',
};

const EIP712_TYPES = {
  ExchangeAction: [
    { name: 'payloadHash', type: 'bytes32' },
    { name: 'nonce', type: 'uint64' },
  ],
};

/**
 * Generate a unique nonce based on current timestamp
 * SoDEX nonces must be within (T - 2 days, T + 1 day)
 */
function generateNonce() {
  return Date.now();
}

/**
 * Compute payloadHash = keccak256(JSON.stringify(payload))
 * JSON key order MUST match Go struct definition exactly
 */
function computePayloadHash(payload) {
  const json = JSON.stringify(payload);
  return ethers.keccak256(ethers.toUtf8Bytes(json));
}

/**
 * Sign an exchange action with EIP-712
 * @param {object} payload - the action payload
 * @returns {{ signature, nonce, payloadHash }}
 */
async function signAction(payload) {
  const privateKey = process.env.SODEX_PRIVATE_KEY;
  if (!privateKey) throw new Error('SODEX_PRIVATE_KEY not set in .env');

  const wallet = new ethers.Wallet(privateKey);
  const nonce = generateNonce();
  const payloadHash = computePayloadHash(payload);

  const message = { payloadHash, nonce };

  // Sign typed data
  const rawSig = await wallet.signTypedData(EIP712_DOMAIN_SPOT, EIP712_TYPES, message);

  // Prepend byte 0x01 as required by SoDEX typed signature format
  const typedSignature = '0x01' + rawSig.slice(2);

  return { signature: typedSignature, nonce, payloadHash };
}

// ─── REST Calls ──────────────────────────────────────────────

/**
 * Fetch orderbook for a symbol
 */
export async function getOrderbook(symbolID = 1) {
  return client.get('/spot/orderbook', { params: { symbolID } });
}

/**
 * Fetch account state (balances, positions)
 */
export async function getAccount(accountID) {
  return client.get('/spot/account', { params: { accountID } });
}

/**
 * Place a spot order on SoDEX testnet
 * Field order matches PerpsOrderItem Go struct
 */
export async function placeOrder({ symbolID, side, type, price, quantity, timeInForce = 1 }) {
  const accountID = parseInt(process.env.SODEX_ACCOUNT_ID);
  const clOrdID = `sosiq-${Date.now()}`;

  // Payload field order must exactly match Go struct (clOrdID, modifier, side, type, timeInForce, price, quantity)
  const orderItem = {
    clOrdID,
    modifier: 1,
    side,           // 1 = buy, 2 = sell
    type,           // 1 = limit, 2 = market
    timeInForce,    // 1 = GTC, 3 = IOC, 4 = FOK
    price: String(price || '0'),
    quantity: String(quantity),
    reduceOnly: false,
    positionSide: 1,
  };

  const payload = {
    type: 'newOrder',
    params: {
      accountID,
      symbolID,
      orders: [orderItem],
    },
  };

  const { signature, nonce } = await signAction(payload);

  return client.post('/spot/exchange', {
    ...payload.params,
    nonce,
    signature,
  });
}

/**
 * Cancel an existing order
 */
export async function cancelOrder({ symbolID, clOrdID }) {
  const accountID = parseInt(process.env.SODEX_ACCOUNT_ID);

  const payload = {
    type: 'cancelOrder',
    params: { accountID, symbolID, clOrdID },
  };

  const { signature, nonce } = await signAction(payload);

  return client.post('/spot/exchange', {
    ...payload.params,
    nonce,
    signature,
  });
}
