import { createRef } from 'preact';
import { signal, effect } from "@preact/signals";
import { html } from "htm/preact";
import { useEffect, useState } from 'preact/hooks';

import { search_query } from './opfs-global.js';

export default function (props) {

	const input = createRef();
	
	const do_search = () => {
		search_query.value = input.value;
	};

	return html`<dialog id="search">
		<form >
			<span onClick=${props.close}>&times;</span>
			<input type="search" id="search" name="search" value="" placeholder="Filename..." ref=${input} />
			<button onClick=${do_search}>Search</button>
		</form>
	</dialog>`;
}