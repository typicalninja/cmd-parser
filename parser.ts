import Args from './args';

// simple check of checking if it starts with a - 
const isSubCommand = (str: string, optionsOperator: string) => !str?.startsWith(optionsOperator)


const parse = (string: string, options: { prefix: string | null, optionsOperator: string } = { prefix: null, optionsOperator: '-' }) => {
	if(typeof string !== 'string') throw new Error(`Expected string to be a string, received ${typeof string}`);
	if(typeof options.prefix !== 'string' || options.prefix == '') throw new Error(`Expected prefix to be a string, received ${typeof options.prefix}`);
	if(options.optionsOperator && (options.optionsOperator == '' || typeof options.optionsOperator !== 'string') ) throw new Error('optionsOperator must be a string');
	if(!options.optionsOperator) options.optionsOperator = '-'
	// string doesn't start with the given prefix, return null so user can handle it
	if(!string.startsWith(options.prefix)) return null
	const PreArgs = string.slice(options.prefix.length).trim().split(/ +/);
	if(!PreArgs) return null;
	// command is PreArgs[0] and args are PreArgs[1] onwards
	const command = PreArgs.shift();
	let subCommand = null;
	if(isSubCommand(PreArgs[0], options.optionsOperator)) {
		subCommand = PreArgs[0] ?? null;
		// shift so the subcommand will not be included as a args
		PreArgs.shift();
	}
	const RemainingArgs = PreArgs.join(' ');
	const ProcessedArgs = RemainingArgs.split(options.optionsOperator).filter(a => a).map(a => ({  name: a.split(' ')[0], value: a.split(' ').slice(1).join(' ') }));
	return {
		command,
		args: new Args(ProcessedArgs),
		subCommand
	}
}

export { parse, Args }