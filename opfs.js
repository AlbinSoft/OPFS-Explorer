import { h, render } from "preact";
import { signal, effect } from "@preact/signals";
import { html } from "htm/preact";
import { useEffect, useState } from 'preact/hooks';

import { tree, list }       from './opfs-global.js';
import { upath, upathRed }  from './opfs-global.js';
import storage              from './opfs-storage.js';
import Tree                 from './opfs-tree.js';
import List                 from './opfs-list.js';
import PromptSearch         from './opfs-search.js';
import PromptDirectory      from './opfs-directory.js';
import PromptFiles          from './opfs-files.js';

const elm_app = document.querySelector('.app');

effect(() => {
	storage.load_tree().then(struct => {
console.log('load_tree.got', struct);
		tree.value = struct;

	});
});

function App(props) {

	const [ searching, setSearching ] = useState(false);
	const [ creating,  setCreating  ] = useState(false);
	const [ uploading, setUploading ] = useState(false);

	useEffect(() => {
		if(location.hash=='#search') setSearching(true);
	}, []);

	useEffect(() => {
		if(searching) setCreating(false);
		if(searching) setUploading(false);
	}, [ searching ]);

	useEffect(() => {
		if(creating) setSearching(false);
		if(creating) setUploading(false);
	}, [ creating ]);

	useEffect(() => {
		if(uploading) setSearching(false);
		if(uploading) setCreating(false);
	}, [ uploading ]);

	const refresh_tree = () => {
		storage.load_tree().then(struct => {
console.log('load_tree.got', struct);
			tree.value = struct;
		});
	};

	const [ top_path, entries ] = upathRed.get_entries(upath.value);
console.log('top_path', top_path);
console.log('list.value', list.value);

	return html`
		<nav>
			<a href="#search" onClick=${() => setSearching(true)}><span class="ico ico_search" ></span><span class="lbl">Search</span></a>
			<a href="#search" onClick=${() => refresh_tree()}    ><span class="ico ico_refresh"></span><span class="lbl">Refresh</span></a>
			<a href="#search" onClick=${() => setCreating(true)} ><span class="ico ico_folder" ></span><span class="lbl">Folder</span></a>
			<a href="#search" onClick=${() => setUploading(true)}><span class="ico ico_files"  ></span><span class="lbl">Files</span></a>
		</nav>

		${ searching ? html`<${PromptSearch}    close=${() => setSearching(false)}  />` : '' }
		${ creating  ? html`<${PromptDirectory} close=${() => setCreating(false)}   />` : '' }
		${ uploading ? html`<${PromptFiles}     close=${() => setUploading(false)}  />` : '' }

		<main>
			${ list.value.length===0 ? html`<${Tree} is_top=${true} top_path=${top_path} entries=${entries} />` : '' }
			${ list.value.length!==0 ? html`<${List} entries=${list} />` : '' }
		</main>
	`;
}

render(html`<${App} />`, elm_app);
