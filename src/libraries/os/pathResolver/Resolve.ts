import PathResolverForSteam from "./PathResolverForSteam";
import PathResolverForOculus from "./PathResolverForOculus";

export const resolveInstallPath = async (): Promise<string | undefined> => {
  const steam = await PathResolverForSteam.findPath();
  if (steam !== undefined) {
    return steam;
  }

  const oculus = await PathResolverForOculus.findPath();
  if (oculus !== undefined) {
    return oculus;
  }

  return undefined;
};

export default resolveInstallPath;
