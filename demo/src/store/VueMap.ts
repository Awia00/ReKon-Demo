import Vue from 'vue';
import { FunctionMapper } from 'vuex';

interface VueMapStore<V> {
    [id: string]: V;
    [id: number]: V;
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

    public setAllIdFunc(list: V[], callbackfn: (value: V) => string): void {
        list.forEach((value) => {
            this.set(callbackfn(value), value);
        });
    }

    public setAll(list: Array<{key: string, value: V}>) {
        list.forEach(({key, value}) => {
            this.set(key, value);
        });
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

    public map<U>(callbackfn: (value: V) => U, thisArg?: any): U[] {
        const values = this.values();
        let elem = values.next();
        const result: U[] = [];
        while (!elem.done) {
            result.push(callbackfn(elem.value));
            elem = values.next();
        }
        return result;
    }

    public filter(callbackfn: (value: V) => boolean, thisArg?: any): V[] {
        const values = this.values();
        let elem = values.next();
        const result: V[] = [];
        while (!elem.done) {
            if (callbackfn(elem.value)) {
                result.push(elem.value);
            }
            elem = values.next();
        }
        return result;
    }

    public reduce<T>(callbackfn: (previousValue: T, currentValue: V) => T, initialValue: T): T {
        const values = this.values();
        let elem = values.next();
        let result: T = initialValue;
        while (!elem.done) {
            result = callbackfn(result, elem.value);
            elem = values.next();
        }
        return result;
    }
}
