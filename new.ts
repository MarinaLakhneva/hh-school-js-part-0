const testBlock = (name: string): void => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};

const areEqual = (a: any, b: any): boolean => {
    if (Array.isArray(a) && Array.isArray(b)) {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    return a === b;
};

const test = (whatWeTest: string, actualResult: any, expectedResult: any): void => {
    if (areEqual(actualResult, expectedResult)) {
        console.log(`[OK] ${whatWeTest}\n`);
    } else {
        console.error(`[FAIL] ${whatWeTest}`);
        console.debug('Expected:');
        console.debug(expectedResult);
        console.debug('Actual:');
        console.debug(actualResult);
        console.log('');
    }
};

const getType = (value: any): string => {
    return typeof value;
};

const getTypesOfItems = (arr: any[]): string[] => {
    return arr.map((item) => typeof item);
};

const allItemsHaveTheSameType = (arr: any[]): boolean => {
    if (arr == null || arr.length === 0) {
        return true;
    }

    const firstElementType = typeof arr[0];

    for (let i = 1; i < arr.length; i++) {
        const currentElementType = typeof arr[i];
        if (firstElementType !== currentElementType) {
            return false;
        }
    }

    return true;
};

const realTypeOf = (val: any): string => {
    if (Number.isNaN(val)) {
        return 'NaN';
    }
    if (val === Number.POSITIVE_INFINITY || val === Number.NEGATIVE_INFINITY) {
        return 'Infinity';
    }
    if (val?.toString && typeof val.toString === 'function' && val.toString().slice(0, 6) === 'class ') {
        return 'Class';
    }
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
};

const getRealTypesOfItems = (arr: any[]): string[] => {
    return arr.map((item) => realTypeOf(item));
};

const everyItemHasAUniqueRealType = (arr: any[]): boolean => {
    if (arr == null || arr.length === 0) {
        return true;
    }

    return new Set(arr.map((item) => realTypeOf(item))).size === arr.length;
};

const countRealTypes = (arr: any[]): [string, number][] => {
    let array = [];
    array = Object.entries(arr.reduce((acc, val) => {
        acc[realTypeOf(val)] = (acc[realTypeOf(val)] || 0) + 1;
        return acc;
    }, {}));
    return array.sort();
};

testBlock('getType');
test('Boolean', getType(true), 'boolean');
test('Number', getType(123), 'number');
test('String', getType('whoo'), 'string');
test('Array', getType([]), 'object');
test('Object', getType({}), 'object');
test(
    'Function',
    getType(() => {}),
    'function'
);
test('Undefined', getType(undefined), 'undefined');
test('Null', getType(null), 'object');
testBlock('allItemsHaveTheSameType');
test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);

test('All values are strings', allItemsHaveTheSameType(['11', '12', '13']), true);

test('All values are strings but wait', allItemsHaveTheSameType(['11', new String('12'), '13']), false);

test('Values like a number', allItemsHaveTheSameType([123, 123 / +('a'), 1 / 0]), true);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes: any[] = [
    true,
    32,
    'string',
    [],
    {},
    function () {},
    undefined,
    null,
    NaN,
    Infinity,
    new Date(),
    new RegExp('foo'),
    new Set(),
];

test('Check basic types', getTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'object',
    'object',
    'function',
    'undefined',
    'object',
    'number',
    'number',
    'object',
    'object',
    'object',
]);

test('Check real types', getRealTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'array',
    'object',
    'function',
    'undefined',
    'null',
    'NaN',
    'Infinity',
    'date',
    'regexp',
    'set',
]);

testBlock('everyItemHasAUniqueRealType');
test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);
test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, +('123') === 123]), false);
test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);
testBlock('countRealTypes');
test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);
test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);
