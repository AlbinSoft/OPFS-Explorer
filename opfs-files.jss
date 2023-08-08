import { createRef } from 'preact';
import { signal, effect } from "@preact/signals";
import { html } from "htm/preact";
import { useEffect, useState } from 'preact/hooks';

import { upath } from './opfs-global.js';

export default function (props) {
	const callee = arguments.callee;

	const [ files, setFiles ] = useState([]);

	const [ storing, setStoring ] = useState(false);

	const input = createRef();
	
	const do_search = () => {
		search_query.value = input.value;
	};

	useEffect(() => {
		if(!storing) store_files();
	}, files);

	const choose_files = async (evt) => {
		evt.preventDefault();
	};

	const store_files = async () => {
		setStoring(true);
		const gimme_files = function *() {
			let itr = 0;
			if(files[itr]) {
				files[itr].do = new Promise((res, rej) => {
					setTimeout(res, 1000);
				});
				yield files[itr++];
			}
			return null;
		};
//		let file = gimme_files();
//		while(file) {
		for(file of gimme_files())
//			const f = {...file.value};
//			f.status = 'processed';
			await file.do();
			file.status = 'processed';
//			file.value = f;
//			file = gimme_file();
			callee();
		}
		setStoring(false);
	};

	const str_path = '/'+upath.value.join('/');

	return html`<dialog id="create" open>
		<form >
			<span onClick=${props.close}>&times;</span>
			<span>${str_path}</span>
			<input type="text" id="dirname" name="dirname" value="" placeholder="Directory name..." ref=${input} />
			<button onClick=${do_search}>Create</button>
			<button onClick=${choose_files}>Choose files</button>
		</form>
		${ files.map(file => {
			return html`<p>
				${file.name} ... ${file.status}
			</p>`;
		})}
	</dialog>`;
}