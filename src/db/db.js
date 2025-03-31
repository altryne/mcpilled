// Firebase is no longer used but we keep empty exports
// to prevent import errors in files that haven't been migrated

// Mock objects with empty implementations
export const db = {
  collection: () => ({
    doc: () => ({
      get: async () => ({
        exists: false,
        data: () => null
      })
    })
  })
};

export const storage = {
  ref: () => ({
    getBytes: async () => new Uint8Array()
  })
};

export const staticStorage = {
  ref: () => ({
    getBytes: async () => new Uint8Array()
  })
};
