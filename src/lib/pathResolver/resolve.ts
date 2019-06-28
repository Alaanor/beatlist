import PathResolverForSteam from './pathResolverForSteam';
import PathResolverForOculus from '@/lib/pathResolver/pathResolverForOculus';

export const resolveInstallPath = async () => {
  const steam = await PathResolverForSteam.findPath();
  if (steam !== undefined) {
    return steam;
  }

  const oculus = await PathResolverForOculus.findPath();
  if (oculus !== undefined) {
    return oculus;
  }

  return null;
};
