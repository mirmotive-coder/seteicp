import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback, useEffect, useRef } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

let storageClientCache: StorageClient | null = null;

export function useStorageClient() {
  const clientRef = useRef<StorageClient | null>(storageClientCache);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (storageClientCache) {
        clientRef.current = storageClientCache;
        return;
      }
      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const client = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      storageClientCache = client;
      if (!cancelled) {
        clientRef.current = client;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Upload a File/Blob to blob storage and return its direct HTTP URL.
   */
  const uploadImage = useCallback(
    async (file: File, onProgress?: (pct: number) => void): Promise<string> => {
      // Ensure client is ready (lazy init if effect hasn't fired yet)
      let client = clientRef.current;
      if (!client) {
        const config = await loadConfig();
        const agent = new HttpAgent({ host: config.backend_host });
        if (config.backend_host?.includes("localhost")) {
          await agent.fetchRootKey().catch(() => {});
        }
        client = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        );
        storageClientCache = client;
        clientRef.current = client;
      }

      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await client.putFile(bytes, onProgress);
      const url = await client.getDirectURL(hash);
      return url;
    },
    [],
  );

  return { uploadImage };
}
