import { createRef } from 'preact';
import { signal, effect } from "@preact/signals";
import { html } from "htm/preact";
import { useEffect, useState } from 'preact/hooks';

import storage from './opfs-storage.js';
import { upath } from './opfs-global.js';

export default function (props) {

	const dialog = createRef();
	const input = createRef();

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

	const do_create = (evt) => {
		evt.preventDefault();
		storage.create_directory(input.current.value);
		props.close();
	};

	const str_path = '/'+upath.value.join('/');

	return html`<dialog id="create" ref=${dialog}>
		<form class="directory_form">
			<span class="btn_close" onClick=${props.close}></span>
			<h2>Create folder</h2>
			<span>${str_path}</span>
			<input class="directory_name" type="text" id="dirname" name="dirname" value="" placeholder="Directory name..." ref=${input} />
			<button class="btn_create" onClick=${do_create}>Create</button>
		</form>
	</dialog>`;
}