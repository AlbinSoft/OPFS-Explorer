import { createRef } from 'preact';
import { signal, effect } from "@preact/signals";
import { html } from "htm/preact";
import { useEffect, useState } from 'preact/hooks';

import storage from './opfs-storage.js';
import { upath } from './opfs-global.js';

export default function (props) {

	const input = createRef();
	
	const do_create = (evt) => {
		evt.preventDefault();
		storage.create_directory(input.current.value);
		props.close();
	};

	const str_path = '/'+upath.value.join('/');

	return html`<dialog id="create" open>
		<form >
			<span onClick=${props.close}>&times;</span>
			<span>${str_path}</span>
			<input type="text" id="dirname" name="dirname" value="" placeholder="Directory name..." ref=${input} />
			<button onClick=${do_create}>Create</button>
		</form>
	</dialog>`;
}