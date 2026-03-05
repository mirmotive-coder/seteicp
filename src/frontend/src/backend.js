// Auto-generated IDL matching src/backend/main.mo
import { Actor, HttpAgent } from "@dfinity/agent";

export const idlFactory = ({ IDL }) => {
  const Product = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    price: IDL.Float64,
    image: IDL.Text,
    pieceCount: IDL.Text,
    peopleRecommended: IDL.Text,
    category: IDL.Text,
    enabled: IDL.Bool,
  });

  const OrderItem = IDL.Record({
    productId: IDL.Nat,
    name: IDL.Text,
    price: IDL.Float64,
    quantity: IDL.Nat,
  });

  const Order = IDL.Record({
    orderNumber: IDL.Nat,
    items: IDL.Vec(OrderItem),
    totalPrice: IDL.Float64,
    phone: IDL.Text,
    customerName: IDL.Text,
    address: IDL.Text,
    deliveryType: IDL.Text,
    deliveryTime: IDL.Text,
    createdAt: IDL.Int,
  });

  const OrderInput = IDL.Record({
    items: IDL.Vec(OrderItem),
    totalPrice: IDL.Float64,
    phone: IDL.Text,
    customerName: IDL.Text,
    address: IDL.Text,
    deliveryType: IDL.Text,
    deliveryTime: IDL.Text,
  });

  return IDL.Service({
    // Products
    getProducts: IDL.Func([], [IDL.Vec(Product)], ["query"]),
    getAllProducts: IDL.Func([], [IDL.Vec(Product)], ["query"]),
    addProduct: IDL.Func(
      [IDL.Text, IDL.Float64, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [Product],
      [],
    ),
    updateProduct: IDL.Func(
      [IDL.Nat, IDL.Text, IDL.Float64, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [IDL.Bool],
      [],
    ),
    toggleProductEnabled: IDL.Func([IDL.Nat], [IDL.Bool], []),

    // Orders
    submitOrder: IDL.Func([OrderInput], [Order], []),
    getOrders: IDL.Func([], [IDL.Vec(Order)], ["query"]),

    // Blob storage (from BlobMixin)
    putBlob: IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [IDL.Text], []),
    getBlob: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(IDL.Nat8))], ["query"]),
    getBlobUrl: IDL.Func([IDL.Text], [IDL.Text], ["query"]),
  });
};

export const canisterId =
  typeof process !== "undefined" ? process.env.CANISTER_ID_BACKEND || "" : "";

export const init = ({ IDL: _IDL }) => {
  return [];
};

export class ExternalBlob {
  constructor(data) {
    this.data = data;
    this.onProgress = undefined;
  }

  static fromURL(url) {
    const blob = new ExternalBlob(null);
    blob._url = url;
    return blob;
  }

  async getBytes() {
    if (this._url) {
      const response = await fetch(this._url);
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    }
    if (this.data instanceof Uint8Array) return this.data;
    if (this.data instanceof ArrayBuffer) return new Uint8Array(this.data);
    return new Uint8Array(0);
  }
}

/**
 * Creates a real ICP actor using the idlFactory.
 * Signature: createActor(canisterId, uploadFile, downloadFile, options)
 * where options may include { agent, agentOptions, processError }
 */
export const createActor = (
  canisterId,
  _uploadFile,
  _downloadFile,
  options = {},
) => {
  const { agent: providedAgent, agentOptions = {}, processError } = options;

  const agent =
    providedAgent ||
    new HttpAgent({
      ...agentOptions,
    });

  const rawActor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });

  if (!processError) return rawActor;

  // Wrap each method to run processError on failures
  return new Proxy(rawActor, {
    get(target, prop) {
      const value = target[prop];
      if (typeof value !== "function") return value;
      return async (...args) => {
        try {
          return await value.apply(target, args);
        } catch (e) {
          processError(e);
        }
      };
    },
  });
};

export const CreateActorOptions = {};
