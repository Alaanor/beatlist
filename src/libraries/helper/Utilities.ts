function byIndex(obj: any, index: string): any {
  return index.split(".").reduce((o, i) => o[i], obj);
}

export default { byIndex };
