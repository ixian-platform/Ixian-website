import { redirect } from 'next/navigation';

export function generateMetadata() {
  redirect('https://resources.ixian.io/nodeStatus.txt');
  return {};
}

export default function NodeStatus() {
  return null;
}
