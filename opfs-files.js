import { createRef } from 'preact';
import { signal, effect } from "@preact/signals";
import { html } from "htm/preact";
import { useEffect, useState } from 'preact/hooks';

import { upath } from './opfs-global.js';
import Storage from './opfs-storage.js';

export default function (props) {

	const dialog = createRef();

	const [ files, setFiles ] = useState([]);
	const [ undone, setUndone ] = useState(0);

	const [ storing, setStoring ] = useState(false);
	const [ muststop, setMustStop ] = useState(false);

	useEffect(() => {
		const x = (e) => {
			if(e.target==dialog.current) props.close();
		};
		window.addEventListener('click', x);
		return () => {
			window.removeEventListener('click', x);
		};
	}, [dialog.current]);

	useEffect(() => {
		dialog.current && dialog.current.showModal();
	}, [dialog.current]);

	useEffect(() => {
		if(!storing && undone>0) store_files();
	}, [files]);

	const choose_files = async (evt) => {
		evt.preventDefault();
console.log('choose_files');
		const fileHandles = await window.showOpenFilePicker({ multiple: true });
console.log('Files in queue', files);
console.log(fileHandles);
		if(fileHandles.length) {
			let cnt = 0;
			const tmp = [...files];
			fileHandles.map(fileHandle => {
				const info = {
					name: fileHandle.name,
					hfile: fileHandle,
					status: 'waiting',
				};
console.log('FileInfo', info);
				tmp.push(info);
				cnt++;
			});
console.log('Files to queue', tmp);
			setFiles(tmp);
			setUndone((undone) => undone + cnt);
		}
	};

	const store_files = async () => {
console.log('store_files');
		setStoring(true);
		let itr = 0;
		let file = files[itr] ?? null;;
		while(file) {
			await store_file(itr, file);
			file = files[++itr] ?? null;
			if(muststop) break;
		}
		setStoring(false);
	};

	const store_file = async (itr, file) => {
console.log('store_file', itr);
		const filex = [...files];
		file.status = 'writing';
		filex[itr] = file;
		setFiles(filex);

		file.blob = await file.hfile.getFile();
		Storage.store_file(file.name, file.blob).then(() => {
			const filex = [...files];
			file.status = 'written';
			filex[itr] = file;
			setFiles(filex);
			setUndone((undone) => {console.log('undone', undone); return undone - 1});
		});
	};

	const str_path = '/'+upath.value.join('/');

	return html`<dialog id="create" ref=${dialog}>
		<form class="files_upload">
			<span class="btn_close" onClick=${props.close}></span>
			<h2>Upload files</h2>
			<span>${str_path}</span>
			<button class="btn_choose" onClick=${choose_files}>Choose files</button>
		</form>
		<p class="files_status">${ muststop ? 'Aborting' : storing ? 'Storing '+undone : 'Idle '}</p>
		<ul class="files_uploading">
			${ files.map(file => {
				console.log('Files.map', file);
				return html`<li>
					<span class="lbl">${file.name}</span>
					<span class="ico ico_${file.status}"></span>
				</li>`;
			} ) }
		</ul>
	</dialog>`;
}
