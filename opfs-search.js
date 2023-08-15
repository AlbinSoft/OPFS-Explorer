import { createRef } from 'preact';
import { signal, effect } from "@preact/signals";
import { html } from "htm/preact";
import { useEffect, useState } from 'preact/hooks';

import { search_query } from './opfs-global.js';

export default function (props) {

	const dialog = createRef();
	const input  = createRef();

	useEffect(() => {
		input.current.value = search_query.value;
		input.current.focus();
	}, [input.current, search_query.value]);

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

	const do_search = (evt) => {
		evt.preventDefault();
		if(input.current.value.length) {
			search_query.value = input.current.value;
			props.close();
		}
	};

	return html`<dialog id="search" ref=${dialog}>
		<form class="search_form">
			<span class="btn_close" onClick=${props.close}></span>
			<h2>Search files</h2>
			<input class="search_query" type="search" id="query" name="query" value="" placeholder="Filename..." ref=${input} />
			<button class="btn_search" onClick=${do_search}>Search</button>
		</form>
	</dialog>`;
}