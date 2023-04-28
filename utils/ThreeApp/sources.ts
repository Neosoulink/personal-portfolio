// MODELS
import FoxGLTF from "../../assets/models/Fox/glTF/Fox.gltf?url";

// TEXTURES
import nxEnvImg from "../../assets/img/textures/environmentMaps/0/nx.jpg";
import nyEnvImg from "../../assets/img/textures/environmentMaps/0/ny.jpg";
import nzEnvImg from "../../assets/img/textures/environmentMaps/0/nz.jpg";
import pxEnvImg from "../../assets/img/textures/environmentMaps/0/px.jpg";
import pyEnvImg from "../../assets/img/textures/environmentMaps/0/py.jpg";
import pzEnvImg from "../../assets/img/textures/environmentMaps/0/pz.jpg";

import dirtColorImg from "../../assets/img/textures/dirt/color.jpg";
import dirtNormalImg from "../../assets/img/textures/dirt/normal.jpg";

export interface SourceType {
	name: string;
	type: "cubeTexture" | "texture" | "gltfModel";
	path: string | string[];
}

const SOURCES: SourceType[] = [
	{
		name: "environmentMapTexture",
		type: "cubeTexture",
		path: [nxEnvImg, nyEnvImg, nzEnvImg, pxEnvImg, pyEnvImg, pzEnvImg],
	},
	{
		name: "grassColorTexture",
		type: "texture",
		path: dirtColorImg,
	},
	{
		name: "grassNormalTexture",
		type: "texture",
		path: dirtNormalImg,
	},
	{
		name: "foxModel",
		type: "gltfModel",
		path: FoxGLTF,
	},
];

export default SOURCES;
