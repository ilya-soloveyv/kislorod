export default {
    name: 'BuildingEdit',
    created: function () {
        this.get()
    },
    data: () => {
        return {
            menu: [
                {
                    title: 'Основное',
                    uri: 'basic'
                },
                {
                    title: 'Планировки',
                    uri: 'plan'
                },
                {
                    title: 'Квартиры',
                    uri: 'apartment'
                },
                {
                    title: 'Этапы',
                    uri: 'stage'
                },
            ],
            menuActive: 0,
            building: {
                Advantages: [],
                Stages: [],
                plans: [],
                apartaments: []
            }
        }
    },
    components: {
        'picture-input': PictureInput,
    },
    props: [
        'iBuildingID'
    ],
    methods: {
        get: function () {
            if (this.iBuildingID && this.iBuildingID > 0) {
                axios.post('/admin/BuildingEdit', {
                    iBuildingID: this.iBuildingID
                })
                .then( (response) => {
                    this.building = response.data.building,
                    this.type = response.data.type
                })
            }    
        },
        update: function () {
            axios.post('/admin/BuildingUpdate', {
                building: this.building
            })
            .then( (response) => {
                Vue.set(this, 'building', response.data)
                var redirect = '/building/' + response.data.iBuildingID + '/' + this.menu[this.menuActive].uri
                this.$router.push(redirect)
            })
        },
        buildingRemove: function () {
            axios.post('/admin/BuildingRemove', {
                building: this.building
            })
            .then( (response) => {
                this.$router.push('/building')
            })
        },
        uploadAvatar: function (column) {
            var formData = new FormData();
                formData.append(column, this.$refs[column].file);
            axios.post('/admin/BuildingUploadAvatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'column': column
                }
            }).then( (response) => {
                Vue.set(this.building, column, response.data.file.filename)
            })
        },
    },
    template: `
        <div class="main-content building-edit">

            <div class="header building-edit-header">
                <picture-input
                    ref="sBuildingCoverSmall"
                    @change="uploadAvatar('sBuildingCoverSmall')"
                    width="1170"
                    height="350"
                    margin="0"
                    radius="0"
                    accept="image/jpeg,image/png"
                    size="50"
                    v-bind:prefill="Object.keys(building).length !== 0 && building.sBuildingCoverSmall != null ? '/images/building/'+building.sBuildingCoverSmall : ''"
                    buttonClass="btn btn-primary btn-sm"
                    :hideChangeButton='true'
                    :customStrings="{
                        drag: 'Перетащите изображение<br>или<br>нажмите для выбора файла<br>(1170px / 450px)'
                    }"></picture-input>
                <div class="container-fluid" style="z-index:1000000000">
                    <div class="header-body mt-n5 mt-md-n6">
                        <div class="row align-items-end">
                            <div class="col-auto">
                                <div class="avatar avatar-xxl header-avatar-top">
                                    <picture-input
                                        ref="sBuildingAvatar"
                                        @change="uploadAvatar('sBuildingAvatar')"
                                        width="128"
                                        height="128"
                                        margin="0"
                                        radius="0"
                                        accept="image/jpeg,image/png"
                                        size="50"
                                        v-bind:prefill="Object.keys(building).length !== 0 && building.sBuildingAvatar != null ? '/images/building/'+building.sBuildingAvatar : ''"
                                        buttonClass="btn btn-primary btn-sm"
                                        :hideChangeButton='true'
                                        :customStrings="{
                                            drag: 'Нажмите для выбора файла<br>(100px / 100px)'
                                            }"></picture-input>
                                </div>
                            </div>
                            <div class="col mb-3 ml-n3 ml-md-n2">
                                <h6 class="header-pretitle">Объект</h6>
                                <h1 class="header-title">{{ building.sBuildingTitle }}</h1>
                            </div>
                        </div>
                        <div class="row align-items-center">
                            <div class="col">
                                <ul class="nav nav-tabs nav-overflow header-tabs">
                                    <li
                                        class="nav-item"
                                        v-for="(item, index) in menu">
                                        <router-link class="nav-link"
                                            v-bind:class="{ active: menuActive == index }"
                                            v-on:click="useMenu(index)"
                                            v-bind:to="'/building/' + ((building.iBuildingID) ? building.iBuildingID : 'create') + '/' + item.uri"
                                            >{{ item.title }}</router-link>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-auto col-button">
                                <button class="btn btn-primary" type="submit" v-on:click.prevent="update" form="form-building">Сохранить</button>
                                <button class="btn btn-outline-danger ml-1" v-on:click="buildingRemove">Удалить объект</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <router-view v-bind:building="building"></router-view>

        </div>
    `
}
