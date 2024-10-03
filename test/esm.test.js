import PolylineConvert from "../dist/esm/index.mjs"; // ESM import

describe("PolylineConvert ESM tests", () => {
  let polylineConvert;

  beforeAll(() => {
    polylineConvert = new PolylineConvert();
  });

  test("should initialize PolylineConvert class", () => {
    expect(polylineConvert).toBeInstanceOf(PolylineConvert);
  });

  test("should encode a polyline", () => {
    const coordinates = [
      [38.5, -120.2],
      [40.7, -120.95],
      [43.252, -126.453],
    ];
    const encoded = polylineConvert.encode(coordinates);
    expect(encoded).toBe("_p~iF~ps|U_ulLnnqC_mqNvxq`@");
  });

  test("should decode a polyline", () => {
    const encoded = "_p~iF~ps|U_ulLnnqC_mqNvxq`@";
    const decoded = polylineConvert.decode(encoded);
    expect(decoded).toEqual([
      [38.5, -120.2],
      [40.7, -120.95],
      [43.252, -126.453],
    ]);
  });
});
