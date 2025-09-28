export type VoxelCallbackResult = number | undefined;

export type VoxelCallback = (x: number, y: number, z: number) => VoxelCallbackResult | Promise<VoxelCallbackResult>;
