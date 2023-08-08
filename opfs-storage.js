
import { upath, treeRed } from './opfs-global.js';

let root    = null;

/* (async function () {
	root = await navigator.storage.getDirectory();
console.log('root', root);
})(); */

const create_directory = async (dirname) => {
	let hdir = root;
	for await(let dirname of upath.value) {
		const tmp = await hdir.getDirectoryHandle(dirname, { create: false });
	console.log('stmp', tmp);
		if(tmp) hdir = tmp; 
		if(!tmp) throw(new Exception('DirNotFound '+dirname));
	}
/*
	await upath.value.map(async (dirname) => {
		const tmp = await hdir.getDirectoryHandle(dirname, { create: false });
	console.log('stmp', tmp);
		if(tmp) hdir = tmp; 
		if(!tmp) throw(new Exception('DirNotFound '+dirname));
	});
*/
	console.log('hdir', hdir);
	const tmp = await hdir.getDirectoryHandle(dirname, { create: true });
	console.log('tmp', tmp);
//	const tmb = await root.getDirectoryHandle(upath.value.join('/')+'/'+dirname, { create: true });
//	console.log('tmp', tmb);
	if(!tmp) throw(new Exception('DirNotCreated '+dirname));
	return tmp;
};

const store_file = async (fname, fblob) => {
	let hdir = root;
	/*
	upath.value.map(async (dirname) => {
console.log('store_file opening '+dirname+' on ', hdir);
		const tmp = await hdir.getDirectoryHandle(dirname, { create: false });
console.log('store_file found? ', tmp);
		if(tmp) hdir = tmp; 
		if(!tmp) console.log('Exception'); // throw(new Exception('DirNotFound '+dirname));
	});
	*/
	const path = [...upath.value];
	hdir = treeRed.get_directory_handler(path);
console.log('hdir', hdir);
	const freader  = new FileReader();
	freader.onload = async function() {
		let hfile = await hdir.getFileHandle(fname,  {create: true});
		let fwrite = await hfile.createWritable();
		await fwrite.write(freader.result);
		await fwrite.close();
	};
	freader.readAsDataURL(fblob);
}

const load_tree = function () {
console.log('load_tree');
	return new Promise(async (res, rej) => {
		root = root ?? await navigator.storage.getDirectory();
		console.log('root', root);

		console.time('explore_root');
		let id = 0;
		const walkdir = async function (dir) {
			let entries = [];
			for await (let [en, eh] of dir) {							// DirName DirHandler
// console.log(eh.kind);
				if(eh.kind=='directory') {
					entries.push({
						id: ++id,
						kind: 'd',
						name: en,
						handler: eh,
						entries: await walkdir(eh),
					});
				} else {
					let ef = await eh.getFile();
					let es = ef.size;
					let et = ef.lastModified;
					entries.push({
						id: ++id,
						kind: 'f',
						name: en,
						size: es,
						time: et,
						handler: eh,
						dts:  (new Date(et)).toLocaleString()
					})
				}
			}
			return entries;
		}
		const entries = await walkdir(root);
		console.timeEnd('explore_root');
console.log('load_tree.res', entries);
		res(entries);
	});
}

export default {
	load_tree,
	create_directory,
	store_file,
};
