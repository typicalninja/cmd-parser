class Args {
	private _map: Map<any, any>;
	rawArgs: { name: string, value: string }[];
	constructor(processedArgs: { name: string, value: string }[]) {
		this.rawArgs = processedArgs;
		this._map = new Map();
		for(const arg of processedArgs) { this._map.set(arg.name, arg.value) }
	/*	processedArgs.forEach(arg => {
			this._map.set(arg.name, arg.value);
		});*/
	}
	/**
	 * Gets a arg from the internal map
	 * @param arg - the argument to get
	 * @returns 
	 * @example
	 * ```
	 * const commandString = `!eval -code \`\`\`some kind of code here\`\`\` -some "other option"`;
	 * const { args } = parse(commandString, { prefix: '!' });
	 * 
	 * console.log(args.get('code'))
	 * ```
	 */
	get(arg: String, ErrorIfNotFound: Boolean): string | undefined {
		if(ErrorIfNotFound && !this._map.has(arg)) throw new Error(`Argument ${arg} not found`);
		return this._map.get(arg);
	}
	/**
	 * similar to get, but instead of searching with arg name Searches for a single item where the given function returns a truthy value
	 * @param func 
	 * @returns
	 * @example
	 * ```
	 * const commandString = `!eval -code \`\`\`some kind of code here\`\`\` -some "other option"`;
	 * const { args } = parse(commandString, { prefix: '!' });
	 * console.log(args.find((arg, argName) => argName === 'some' && arg.includes('option')))
	 * ``` 
	 */
	find(func: (val: string, key: string) => boolean, thisArg: any): { arg: string, value: string } | undefined {
		if(typeof func !== 'function') throw new Error('find() requires a function');
		if (typeof thisArg !== 'undefined') func = func.bind(thisArg);
		for(const [key, val] of this._map) {
			if (func(val, key)) return { arg: key, value: val };
		}
		return undefined;
	}
	/**
	 * returns a boolean indicating if the given argument exists
	 * @param arg - Argument / option to check if exists
	 * @param valueNeeded - weather the argument needs to actually have any content returns false if the argument is by itself ("!command -argument")
	 * @returns 
	 * @example
	 * ```
	 * const commandString = `!eval -code \`\`\`some kind of code here\`\`\` -some "other option"`;
	 * const { args } = parse(commandString, { prefix: '!' });
	 * console.log(args.has('code'))
	 * ```
	 */
	has(arg: String, valueNeeded = false): Boolean {
		return valueNeeded ?  this._map.has(arg) && this._map.get(arg) !== '' ? true : false : this._map.has(arg);
	}
	/**
	 * Runs given function on each argument and returns a new Args object with the results, useful for escaping values in all args
	 * @param func 
	 * @example
	 * ```
	 * // assume from a user input (discord bot)
	 * const commandString = `!eval -code \`\`\`some kind of code here\`\`\` -some "other option"`;
	 * const { args } = parse(commandString, { prefix: '!' });
	 * 
	 * console.log(args.parseAllKeys((k, s) => s.replace(/\`/g, '').replace(/"/g, ' ')))
	 * ```
	 */
	parseAllKeys(func: (argument: string, value: string) => string, thisArg?: any): Args {
			if(typeof func !== 'function') throw new Error('parseAllKeys() requires a function');
			if(typeof thisArg !== 'undefined') func = func.bind(thisArg);
			const k = [];
			for(const [key, val] of this._map) {
				const p = func(key, val)
				if(p) k.push({ name: key, value: p });
			}

			return new Args(k);
	}
	/**
	 * Runs the given function on all the values of args and checks if at least one returns false
	 * @param func - function to run for each arg
	 * @param thisArg - this arg to bind the function given to, ignored if undefined
	 * @returns 
	 * @example
	 * ```
	 * 	const commandString = `!help -page 2 -result 10`;
	 * 	const { args } = parse(commandString, { prefix: '!' });
	 * // checks if every val is a number
	 * console.log(args.every((val) => !isNaN(val)))
	 * ```
	 */
	every(func: (arg: string, value: string) => boolean, thisArg?: any): boolean {
		if(typeof func !== 'function') throw new Error('every() requires a function');
		if(typeof thisArg !== 'undefined') func = func.bind(thisArg);
		for (const [key, val] of this._map) {
			if (!func(val, key)) return false;
		}

		return true;
	}
	toJSON() {
		return this.rawArgs;
	}
}

export default Args;
