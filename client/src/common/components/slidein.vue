/**
* Project janux-vuejs-seed
* Created by hielo on 2018-04-24
*/

<template lang="pug">

	.slidein(:class='{ isOpen: isOpen }')
		ul.slidein-menu
			.sd-page-sidebar-wrapper
				.sd-page-sidebar.mobile
					ul.sd-page-sidebar-menu
						li
							a.side-menu-a(v-on:click='ok' :class="{ 'sideMenuActive': readUrl('firstMenuGroup') }")
								span.fa.fa-users.fa-lg
								span &nbsp;&nbsp;{{ $t('staff.title') }}
							ul
								li(v-on:click='ok')
									router-link(:to="{name:'userList'}" active-class="sideMenuActive" class="menuItem")
										span.fa.fa-angle-right(style="font-size: 1.3rem;")
										span(class="itemMenuText") {{ $t('user.listTitle') }}
								li(v-on:click='ok')
									router-link(:to="{name:'staffList'}" active-class="sideMenuActive" class="menuItem")
										span.fa.fa-angle-right(style="font-size: 1.3rem;")
										span(class="itemMenuText") {{ $t('staff.staff') }}
						li
							a.side-menu-a(v-on:click='ok' :class="{ 'sideMenuActive': readUrl('secondMenuGroup') }")
								span.fa.fa-users.fa-lg
								span &nbsp;&nbsp;{{ $t('permission.title') }}
							ul
								li(v-on:click='ok')
									router-link(:to="{name:'roleList'}" active-class="sideMenuActive" class="menuItem")
										span.fa.fa-angle-right(style="font-size: 1.3rem;")
										span(class="itemMenuText") {{ $t('role.title') }}
								li(v-on:click='ok')
									router-link(:to="{name:'authContextList'}" active-class="sideMenuActive" class="menuItem")
										span.fa.fa-angle-right(style="font-size: 1.3rem;")
										span(class="itemMenuText") {{ $t('permission.title') }}
</template>

<script>
import { EventBus } from 'Common/event-bus'

export default {
	name: 'jnx-slidein',
	data: () => ({
		openerText: 'Open',
		isOpen: false,
		menu: [ 'Home', 'Work', 'Contact' ],
		smallMenu: [ 'Tips', 'Resources', 'Shenanigans' ]
	}),
	methods: {
		ok () {
			// this.close()
		},
		open () {
			this.isOpen = true
		},
		close () {
			this.isOpen = false
		},
		toggle () {
			if (this.isOpen) {
				this.close()
			} else {
				this.open()
			}
		},
		readUrl (pathName) {
			let currentRoute = this.$router.currentRoute.fullPath
			if (pathName === 'firstMenuGroup' && (currentRoute === '/user' || currentRoute === '/staff')) {
				return true
			} else if (pathName === 'secondMenuGroup' && (currentRoute === '/role' || currentRoute === '/auth-context')) {
				return true
			} else {
				return false
			}
		}
	},
	mounted () {
		EventBus.$on('toogleSlidein', data => {
			console.log('toogle slide in event trigger!!')
			this.toggle()
		})
	}
}
</script>
