import {LatLng, LatLngExpression, LatLngTuple} from "leaflet";

type PolylineConvertOptionsType = {
    precision: number;
    factor: number;
    dimension: number;
}

class PolylineConvert {
    private readonly precision: number;
    private readonly factor: number;
    private readonly dimension: number;

    constructor(options?: Partial<PolylineConvertOptionsType>) {
        this.precision = options?.precision || 5;
        this.factor = options?.factor || Math.pow(10, this.precision);
        this.dimension = options?.dimension || 2;
    }

    public encode(points: LatLngExpression[]) {
        const flatPoints: number[] = [];
        for (let i = 0, len = points.length; i < len; ++i) {
            const point = points[i];

            if (this.dimension === 2) {
                flatPoints.push(...toLatLngTuple(point));
            } else {
                for (let dim = 0; dim < this.dimension; ++dim) {
                    flatPoints.push(...toLatLngTuple(point));
                }
            }
        }

        return this.encodeDeltas(flatPoints);
    }

    public decode(encoded: string): number[][] {
        const flatPoints = this.decodeDeltas(encoded);

        const points: number[][] = [];
        for (let i = 0, len = flatPoints.length; i + (this.dimension - 1) < len;) {
            const point: number[] = [];

            for (let dim = 0; dim < this.dimension; ++dim) {
                point.push(flatPoints[i++]);
            }

            points.push(point);
        }

        return points;
    }

    private encodeDeltas(numbers: number[]) {
        const lastNumbers = [];

        for (let i = 0, len = numbers.length; i < len;) {
            for (let d = 0; d < this.dimension; ++d, ++i) {
                const num = +numbers[i].toFixed(this.precision);
                const delta = num - (lastNumbers[d] || 0);
                lastNumbers[d] = num;

                numbers[i] = delta;
            }
        }

        return this.encodeFloats(numbers);
    }

    private decodeDeltas(encoded: string): number[] {
        const lastNumbers: number[] = [];

        const numbers = this.decodeFloats(encoded);
        for (let i = 0, len = numbers.length; i < len;) {
            for (let d = 0; d < this.dimension; ++d, ++i) {
                numbers[i] = Math.round((lastNumbers[d] = numbers[i] + (lastNumbers[d] || 0)) * this.factor) / this.factor;
            }
        }

        return numbers;
    }

    private encodeFloats(numbers: number[]) {
        for (let i = 0, len = numbers.length; i < len; ++i) {
            numbers[i] = Math.round(numbers[i] * this.factor);
        }

        return this.encodeSignedIntegers(numbers);
    }

    private decodeFloats(encoded: string) {
        const numbers = this.decodeSignedIntegers(encoded);
        for (let i = 0, len = numbers.length; i < len; ++i) {
            numbers[i] /= this.factor;
        }

        return numbers;
    }

    private encodeSignedIntegers(numbers: number[]) {
        for (let i = 0, len = numbers.length; i < len; ++i) {
            const num = numbers[i];
            numbers[i] = (num < 0) ? ~(num << 1) : (num << 1);
        }

        return this.encodeUnsignedIntegers(numbers);
    }

    private decodeSignedIntegers(encoded: string) {
        const numbers = this.decodeUnsignedIntegers(encoded);

        for (let i = 0, len = numbers.length; i < len; ++i) {
            const num = numbers[i];
            numbers[i] = (num & 1) ? ~(num >> 1) : (num >> 1);
        }

        return numbers;
    }

    private encodeUnsignedIntegers(numbers: number[]) {
        let encoded = '';
        for (let i = 0, len = numbers.length; i < len; ++i) {
            encoded += this.encodeUnsignedInteger(numbers[i]);
        }
        return encoded;
    }

    private decodeUnsignedIntegers(encoded: string) {
        const numbers = [];

        let current = 0;
        let shift = 0;

        for (let i = 0, len = encoded.length; i < len; ++i) {
            const b = encoded.charCodeAt(i) - 63;

            current |= (b & 0x1f) << shift;

            if (b < 0x20) {
                numbers.push(current);
                current = 0;
                shift = 0;
            } else {
                shift += 5;
            }
        }

        return numbers;
    }

    private encodeSignedInteger(num: number) {
        num = (num < 0) ? ~(num << 1) : (num << 1);
        return this.encodeUnsignedInteger(num);
    }

    // This  is very similar to Google's, but I added
    // some stuff to deal with the double slash issue.
    private encodeUnsignedInteger(num: number) {
        let value, encoded = '';
        while (num >= 0x20) {
            value = (0x20 | (num & 0x1f)) + 63;
            encoded += (String.fromCharCode(value));
            num >>= 5;
        }
        value = num + 63;
        encoded += (String.fromCharCode(value));

        return encoded;
    }
}

export function toLatLngTuple(latLng: LatLngExpression): LatLngTuple {
    if (latLng instanceof Array) {
        return [latLng[0], latLng[1]];
    } else if (latLng instanceof LatLng) {
        return [latLng.lat, latLng.lng];
    }
    return [latLng.lat, latLng.lng];
}

export default PolylineConvert;
