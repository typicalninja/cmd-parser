import Args from './args';

// simple check of checking if it starts with a - 
const isSubCommand = (str: string) => !str?.startsWith('-')


const parse = (prefix: string, string: string) => {
	if(typeof string !== 'string') throw new Error(`Expected string to be a string, received ${typeof string}`);
	if(typeof prefix !== 'string') throw new Error(`Expected prefix to be a string, received ${typeof prefix}`);
	// string doesn't start with the given prefix, return null so user can handle it
	if(!string.startsWith(prefix)) return null
	const PreArgs = string.slice(prefix.length).trim().split(/ +/);
	if(!PreArgs) return null;
	// command is PreArgs[0] and args are PreArgs[1] onwards
	const command = PreArgs.shift();
	let subCommand = null;
	if(isSubCommand(PreArgs[0])) {
		subCommand = PreArgs[0] ?? null;
		// shift so the subcommand will not be included as a args
		PreArgs.shift();
	}
	const RemainingArgs = PreArgs.join(' ');
	const ProcessedArgs = RemainingArgs.split('-').filter(a => a).map(a => ({  name: a.split(' ')[0], value: a.split(' ').slice(1).join(' ') }));
	return {
		command,
		args: new Args(ProcessedArgs),
		subCommand
	}
}

export { parse, Args }