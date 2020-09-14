<template>
	<div>
		<div class="skill clearfix">
			<h4>{{title}}</h4>
			<div class="skill-value">{{percentage}}%</div>
		</div>
		<div class="skill-container">
			<div class="skill-percentage" :style="{width : `${percentage}%`}"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Skill",
	props: {
		title: {
			type: String,
			default: "Undefined"
		},
		percentage: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {};
	}
};
</script>

<style lang="less">
</style>
