const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
    const TRIVIAL_PARTITION_KEY = "0";
    const MAX_PARTITION_KEY_LENGTH = 256;

    if (event == null) {
        return TRIVIAL_PARTITION_KEY;
    }

    let candidate;
    if (event.partitionKey) {
        candidate = typeof event.partitionKey !== "string" ? JSON.stringify(event.partitionKey) : event.partitionKey;
    } else {
        const data = JSON.stringify(event);
        candidate = hash(data);
    }

    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
        return hash(candidate);
    }

    return candidate;
};

function hash(data) {
    return crypto.createHash("sha3-512").update(data).digest("hex");
}