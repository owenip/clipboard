const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
    it("Returns the literal '0' when given no input", () => {
        const trivialKey = deterministicPartitionKey();
        expect(trivialKey).toBe("0");
    });
    it("Return new hash when given event does not contain partitionKey", () => {
        const event = {
            test: "test",
        };
        const trivialKey = deterministicPartitionKey(event);
        expect(trivialKey).not.toBe("0");
        expect(trivialKey).not.toBe("test");
    });
    it("Return 'test' when given event.partitionKey is within MAX_PARTITION_KEY_LENGTH", () => {
        const event = {
            partitionKey: "test",
        };
        const trivialKey = deterministicPartitionKey(event);
        expect(trivialKey).toBe("test");
    });
    it("Return rehashed value when given event.partitionKey is over than MAX_PARTITION_KEY_LENGTH", () => {
        // This is a test to see if the partition key is rehashed to a shorter value.
        const event = {
            partitionKey: "x".repeat(300),
        };
        const trivialKey = deterministicPartitionKey(event);
        expect(trivialKey).not.toBe("x".repeat(300));
    });
    it("Return 'test1234' when given event.partitionKey 'test1234' as input that is mixed with letter and numbers", () => {
        const event = {
            partitionKey: "test1234",
        };
        const trivialKey = deterministicPartitionKey(event);
        expect(trivialKey).toBe("test1234");
    });
});