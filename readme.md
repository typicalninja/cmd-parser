# @typicalninja21/cmd-parser

> Made for message command system in discord bots (Does not validate input, just parse the string and return a object with the parsed info)

# Install

```
npm i @typicalninja21/cmd-parser
```

# Usage

```js
const parse = require('@typicalninja21/cmd-parser').parse;

// get this somehow, from discord bot message event etc...
const commandString = `!commands add -type string -name testCommand`

// first argument is the prefix, second is the command string you got
console.log(parse('!', commandString))
```

## OutPut

> This is the result of the above parsed command string, subCommand might be null if no subCommand was found

> this returns a Args class, [you can refer its functions below]

```
{
  command: 'commands',
  args: Args {
    rawArgs: [ [Object], [Object] ],
    _map: Map(2) { 'type' => 'string ', 'name' => 'testCommand' }
  },
  subCommand: 'add'
}
```

## Default values

```
{
  command: string,
  args: Args {values here}
  subCommand: string
}
```


## Args class


### Args.get(argName: String, ErrorIfNotFound: Boolean): String

>   Gets a arg from the internal map

  __Example__

  ```js
   const commandString = `!eval -code \`\`\`some kind of code here\`\`\` -some "other option"`;
	 const { args } = parse('!', commandString);
	 console.log(args.get('code'))
  ```
### Args.find(function: (val: string, key: string) => boolean): String

> similar to get, but instead of searching with arg name Searches for a single item where the given function returns a truthy value

__Example__

```js
const commandString = `!eval -code \`\`\`some kind of code here\`\`\` -some "other option"`;
const { args } = parse('!', commandString);

console.log(args.find((arg, argName) => argName === 'some' && arg.includes('option')))
```

### Args.has(argName: String, valueNeeded: Boolean): Boolean

> returns a boolean indicating if the given argument exists

__Example__

  ```js
   const commandString = `!eval -code \`\`\`some kind of code here\`\`\` -some "other option"`;
   const { args } = parse('!', commandString);
   console.log(args.has('code'))
  ```

## Args.parseAllKeys(func: (argument: string, value: string) => string): Args

> Runs given function on each argument and returns a new Args object with the results, useful for escaping values in all args

  __Example__

  ```js
	 const commandString = `!eval -code \`\`\`some kind of code here\`\`\` -some "other option"`;
	 const { args } = parse('!', commandString);
	 
	 console.log(args.parseAllKeys((k, s) => s.replace(/\`/g, '').replace(/"/g, ' ')))
  ```

## Args.every(func: (arg: string, value: string) => boolean, thisArg?: any): boolean

> Runs the given function on all the values of args and checks if at least one returns false

  __Example__

  ```js
    const commandString = `!help -page 2 -result 10`;
	  const { args } = parse('!', commandString);
	  // checks if every val is a number
	  console.log(args.every((val) => !isNaN(val)))
  ```