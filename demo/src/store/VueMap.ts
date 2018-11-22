import Vue from 'vue';

interface VueMapStore<V> {
    [id: string]: V;
}

export default class VueMap<V> implements Map<string, V> {
    public size: number = 0;
    public [Symbol.toStringTag]: 'Map';
    private store: VueMapStore<V> = {};

    public get(key: string): V | undefined {
        return this.store[key];
    }

    public clear(): void {
        Object.assign(this.store, {});
    }

    public delete(key: string): boolean {
        if (this.store[key] !== undefined) {
            Vue.delete(this.store, key);
            this.size--;
            return true;
        }
        return false;
    }

    public forEach(callbackfn: (value: V, key: string, map: Map<string, V>) => void, thisArg?: any): void {
        Object.keys(this.store).forEach((key, index) => callbackfn(this.store[key], key, this));
    }

    public has(key: string): boolean {
        return this.store[key] !== undefined;
    }

    public set(key: string, value: V): this {
        if (this.store[key] === undefined) {
            Vue.set(this.store, key, value);
            this.size++;
        } else {
            this.store[key] = value;
        }
        return this;
    }

    public [Symbol.iterator](): IterableIterator<[string, V]> {
        return this.entries();
    }

    public entries(): IterableIterator<[string, V]> {
        const entries = Object.entries(this.store);
        function* generator() {
            // tslint:disable-next-line:prefer-for-of
            for (let current = 0; current < entries.length; current++) {
                yield entries[current];
            }
        }
        return generator();
    }

    public keys(): IterableIterator < string > {
        const keys = Object.keys(this.store);
        function* generator() {
            // tslint:disable-next-line:prefer-for-of
            for (let current = 0; current < keys.length; current++) {
                yield keys[current];
            }
        }
        return generator();
    }

    public values(): IterableIterator < V > {
        const values = Object.values(this.store);
        function* generator() {
            // tslint:disable-next-line:prefer-for-of
            for (let current = 0; current < values.length; current++) {
                yield values[current];
            }
        }
        return generator();
    }
}
