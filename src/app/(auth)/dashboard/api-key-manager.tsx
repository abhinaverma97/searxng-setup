"use client";

import { useState } from "react";

interface ApiKey {
  id: string;
  name: string | null;
  key: string | null;
  lastUsed: string | null;
  createdAt: string;
}

export function ApiKeyManager({
  initialKeys,
}: {
  initialKeys: ApiKey[];
}) {
  const [keys, setKeys] = useState(initialKeys);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [name, setName] = useState("");

  async function createKey() {
    const res = await fetch("/api/key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || null }),
    });

    if (!res.ok) return;

    const data = await res.json();
    setNewKey(data.key);
    setName("");

    const listRes = await fetch("/api/key");
    if (listRes.ok) {
      const listData = await listRes.json();
      setKeys(listData.keys);
    }
  }

  async function deleteKey(keyId: string) {
    await fetch("/api/key", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyId }),
    });

    setKeys((prev) => prev.filter((k) => k.id !== keyId));
  }

  function maskKey(key: string | null) {
    if (!key) return "sx_...";
    return key.slice(0, 12) + "..." + key.slice(-4);
  }

  return (
    <div className="space-y-5">
      {newKey && (
        <div className="border border-[#181818] bg-[#080808] p-5 space-y-3">
          <p className="text-sm font-medium text-[#555]">
            API key created — store it securely. It will not be shown again.
          </p>
          <code className="block break-all border border-[#181818] bg-black px-4 py-3 text-sm text-white">
            {newKey}
          </code>
          <button
            onClick={() => setNewKey(null)}
            className="text-xs text-[#555] hover:text-white transition-colors"
          >
            dismiss
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="key name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-[#181818] bg-[#080808] px-4 py-3 text-sm text-white outline-none placeholder:text-[#333]"
        />
        <button
          onClick={createKey}
          className="text-sm text-black px-5 py-3 font-medium bg-[#86efac] hover:opacity-90 transition-opacity"
        >
          create key
        </button>
      </div>

      {keys.length === 0 ? (
        <p className="text-sm text-[#555]">No API keys yet. Create one above.</p>
      ) : (
        <div className="space-y-2">
          {keys.map((k) => (
            <div
              key={k.id}
              className="flex items-center justify-between border border-[#181818] bg-[#080808] px-5 py-4"
            >
              <div className="space-y-1.5">
                <p className="text-sm text-white font-medium">
                  {k.name ?? "unnamed key"}
                </p>
                <code className="text-xs text-[#555]">
                  {maskKey(k.key)}
                </code>
                <p className="text-xs text-[#555]">
                  created {new Date(k.createdAt).toLocaleDateString()}
                  {k.lastUsed &&
                    ` · last used ${new Date(k.lastUsed).toLocaleDateString()}`}
                </p>
              </div>
              <button
                onClick={() => deleteKey(k.id)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
