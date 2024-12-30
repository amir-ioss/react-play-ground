function setVal(array, index, value) {
    if (index < 0) {
        throw new Error("Negative index not allowed");
    }
    array[index] = value; // Automatically fills gaps with `undefined` if needed
    return array;
}


export default setVal