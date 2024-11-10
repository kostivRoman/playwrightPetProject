<script lang="ts">
	import Picture from "$lib/components/Picture/index.svelte";
	import DoubleWinModal from "$lib/components/DoubleWinModal/index.svelte";
	import { modal, secondPopup, firstPopup } from "../../stores";
	import { _ } from "$lib/services/i18n";
	import logo from "../../img/logo.svg";
	import scroll from "../../img/scroll.svg";
	import planeTwo from "../../img/plane_2.png";

	import { getContext, onMount } from "svelte";

	let i18nPrefix = "aviator";
	const settings = <LandSettings>getContext("settings");
	if (settings?.customI18N) {
		i18nPrefix = settings?.customI18N ?? "aviator";
	}

	let winModal = settings?.winModal ?? true;
	let isRedirect = false;
	let oneSpin = true;
	let additionalBG = true;
	let coinsIMG = true;

	const buttonHandler = () => {
		if (settings?.doubleModal) {
			secondPopup.set(true);
			isRedirect = true;
		} else {
			winModal ? modal.set("win-modal") : modal.set("signup");
		}
	};

	onMount(() => {
		if ($secondPopup) {
			isRedirect = true;
		}
	});
</script>

{#if settings?.doubleModal}
	<DoubleWinModal
		{oneSpin}
		prefix={i18nPrefix}
		first={firstPopup}
		second={secondPopup}
		redirect={isRedirect}
		{additionalBG}
		{coinsIMG}
	/>
{/if}

<div class="main">
	<div class="plane">
		<Picture src={planeTwo} alt="plane" class=" w-100 h-100" />
	</div>
	<div class="main-text">
		<div class="logo">
			<img class="logo-img" src={logo} alt="aviator logo" />
		</div>

		<div class="main-title">
			{@html $_(i18nPrefix + ".main_title")}
		</div>

		<button id="playBtn" class="main-btn" on:click={() => buttonHandler()}>
			{@html $_(i18nPrefix + ".game_btn")}
		</button>
		<div class="scroll">
			<img src={scroll} alt="" class="scroll-icon" />
		</div>
	</div>
</div>

<style lang="scss">
	.main {
		position: relative;
		z-index: 21;
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: center;
	}

	.plane {
		position: absolute;
		z-index: 20;
		width: 174px;
		top: -3%;
		right: -5%;
	}

	.main-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 5vh 0 1vh 0;
		margin: 5dvh 0 1dvh 0;

		@supports not (margin: 5dvh 0 1dvh 0) {
			margin: 5vh 0 1vh 0;
		}
	}

	.logo {
		width: 69px;
		height: 61px;
		position: relative;
	}

	.main-title {
		opacity: 1;
		font-weight: 800;
		font-size: 20px;
		line-height: 26px;
		text-align: center;
		text-transform: uppercase;
		z-index: 21;
		margin: 12px auto;
		max-width: 400px;

		:global(br) {
			display: none;
		}
	}

	.main-btn {
		opacity: 1;
		width: 260px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ec002e;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 800;
		text-transform: uppercase;
		z-index: 21;
	}

	.scroll {
		margin-top: 12px;
		width: 57px;
		animation: scrollAnim 1.2s ease-in-out 0s infinite;
	}

	.scroll-icon {
		width: 100%;
		height: 100%;
	}

	@keyframes scrollAnim {
		0% {
			transform: translateY(2px);
			opacity: 1;
		}
		50% {
			transform: translateY(0px);
			opacity: 0.8;
			filter: brightness(1.4);
		}
		100% {
			transform: translateY(2px);
			opacity: 1;
		}
	}

	/* media */

	@media (min-width: 700px) {
		.main-title {
			font-size: 24px;
			line-height: 30px;
			margin: 16px auto;
		}

		.plane {
			width: 232px;
		}
	}
	@media (min-width: 1200px) {
		.main-title {
			font-size: 28px;
			line-height: 32px;
			margin: 20px auto;
			max-width: none;
		}

		.plane {
			width: 281px;
			top: 1%;
		}
	}

	@media (min-width: 1400px) {
		.plane {
			width: 296px;
			top: 11%;
		}
		.scroll {
			width: 70px;
		}
	}
	@media (min-width: 1700px) {
		.plane {
			width: 411px;
			right: 0;
			top: 0;
		}
		.main-text {
			margin: 2.2vh 0 1vh 0;
			margin: 2.2dvh 0 1dvh 0;
		}

		.logo {
			width: 128px;
			height: 115px;
		}

		.main-title {
			font-size: 40px;
			line-height: 54px;
			margin: 24px auto;
		}

		.scroll {
			width: 94px;
			margin-top: 20px;
		}
	}
</style>
