# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

After looking into the code, my thought on the code logis is listed as following:

1. Get Partition Key from event
2. If event is null, return TRIVIAL_PARTITION_KEY
3. If event has a partitionKey, check if it is a string
4. Stringify partitionKey if it is not a string
5. Return partitionKey if it is less than 256 characters
6. Return hash of partitionKey if it is greater than 256 characters

I have moved the if event is null, return TRIVIAL_PARTITION_KEY to the top for early return. This can help triggering termination early as soon as the condition is met. Beside that I have also moved the hashing code to to a separate function as the same line so that there is a single responsibility function for hashing. If any change need to be made for hashing, we only need to change one place, the hash() function.
