const nodeStatusUrl = 'https://resources.ixian.io/nodeStatus.txt';

export interface NodeStatus {
  M: number;
}

export const getNodeStatusData = async (): Promise<NodeStatus> => {
  const res = await fetch(nodeStatusUrl);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return await res.json();
};
