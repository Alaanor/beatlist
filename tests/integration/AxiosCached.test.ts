import AxiosCachedFactory from "@/libraries/net/AxiosCachedFactory";

describe("axios cached", () => {
  it("should cache request", async () => {
    expect.assertions(1);

    const http = AxiosCachedFactory.getAxios("https://duckduckgo.com/");

    const fetch1 = await http.get("/");
    const fetch2 = await http.get("/");

    expect(fetch1).toBe(fetch2);
  });
});
