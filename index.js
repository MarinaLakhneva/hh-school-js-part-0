// Test utils

const testBlock = (name) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};

const areEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    return a === b;
    // Compare arrays of primitives
    // Remember: [] !== []
};

const test = (whatWeTest, actualResult, expectedResult) => {
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

// Functions

const getType = (value) => {
    return typeof value;
    // Return string with a native JS type of value
};

const getTypesOfItems = (arr) => {
    return arr.map((item) => typeof item);
    // Return array with types of items of given array
};

const allItemsHaveTheSameType = (arr) => {
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

const realTypeOf = (val) => {
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

const getRealTypesOfItems = (arr) => {
    return arr.map((item) => realTypeOf(item));
    // Return array with real types of items of given array
};

const everyItemHasAUniqueRealType = (arr) => {
    if (arr == null || arr.length === 0) {
        return true;
    }

    return new Set(arr.map((item) => realTypeOf(item))).size === arr.length;
    // Return true if there are no items in array
    // with the same real type
};

const countRealTypes = (arr) => {
    return Object.entries(
        arr.reduce((acc, val) => {
            acc[realTypeOf(val)] = (acc[realTypeOf(val)] || 0) + 1;
            return acc;
        }, {})
    ).sort();
    // Return an array of arrays with a type and count of items
    // with this type in the input array, sorted by type.
    // Like an Object.entries() result: [['boolean', 3], ['string', 5]]
};

// Tests

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

test('Values like a number', allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]), true);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
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
    // What else?
]);

testBlock('everyItemHasAUniqueRealType');

test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);

test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, '123' === 123]), false);

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

// Add several positive and negative tests
