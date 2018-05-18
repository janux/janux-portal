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
							a.active(href="#" v-on:click='ok')
								span.fa.fa-users.fa-lg
								.btn-text &nbsp;&nbsp;{{ $t('staff.title') }}
							ul
								li(v-on:click='ok')
									router-link(:to="{name:'userList'}" active-class="active")
										span.fa.fa-angle-right
										| &nbsp;&nbsp; {{ $t('user.listTitle') }}
								li(v-on:click='ok')
									router-link(:to="{name:'staffList'}" active-class="active")
										span.fa.fa-angle-right
										| &nbsp;&nbsp; {{ $t('staff.staff') }}
						li
							a.active(href="#" v-on:click='ok')
								span.fa.fa-users.fa-lg
								.btn-text &nbsp;&nbsp;{{ $t('permission.title') }}
							ul
								li(v-on:click='ok')
									router-link(:to="{name:'roleList'}" active-class="active")
										span.fa.fa-angle-right
										| &nbsp;&nbsp; {{ $t('role.title') }}
								li(v-on:click='ok')
									router-link(:to="{name:'authContextList'}" active-class="active")
										span.fa.fa-angle-right
										| &nbsp;&nbsp; {{ $t('permission.title') }}
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
			this.close()
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
