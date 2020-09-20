// from https://stackoverflow.com/q/3162457/8160318; adjusted
export const isLocalNetwork = (hostname: string) => {
  return (
    hostname.includes("localhost") ||
    // [::1] is the IPv6 localhost address.
    hostname.includes("[::1]") ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    hostname.match(/127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/g) ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.0.") ||
    hostname.endsWith(".local")
  );
};
