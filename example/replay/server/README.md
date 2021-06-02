### Overview

A Node.js WebSocket server that allows to replay messaging in order they were written.

### Running guide

```shell
> npm i
> node index.js
```

### Testing connection

```shell
> wscat -c ws://localhost:8000/jerq
```

### Commands

* ```LOAD file.txt``` // Loads file into the memory, pointer is in the beginning. The file should be in ./data folder. No response.
* ```NEXT``` // Moves pointer to the next line. Responds a string.
* ```SCROLL 5``` // Moves pointer to the provided line. Responds multiple strings from current position to provided number.

