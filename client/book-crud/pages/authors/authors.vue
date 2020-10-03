<template>
    <div class="container"><br>
        <div class="card-header">
            Author Management
            <div class="navbar-end">
                <button @click="showAddForm" class="btn btn-success">Add Author</button>
            </div>
        </div><br>
        <div class="card card-default">
            <div class="table">
                <table id="cartstable" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Description</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(author, index) in authors" :key="author.id">
                            <td>{{ author.id }}</td>
                            <td>{{ author.fname }}</td>
                            <td>{{ author.lname }}</td>
                            <td>{{ author.description }}</td>
                            <td>
                                <button class="btn btn-info btn-sm" @click="showEditForm(index)">
                                    Edit
                                </button>
                                <button class="btn btn-danger btn-sm" @click="deleteAuthor(index)">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add Author Modal -->
        <div id="addAuthorModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Enter Author Details</h5>
                        <button type="button" @click="closeAddForm" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger" role="alert" v-if="error !== ''">
                            {{ error }}
                        </div>
                        <v-form>
                            <v-row>
                                <v-col cols="12" md="6" >
                                    <v-text-field clearable v-model="form.fname" label="First name" required ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" >
                                    <v-text-field clearable v-model="form.lname"  label="Last name" required ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12" >
                                    <v-text-field clearable v-model="form.description" label="Description" required ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </div>
                    <div class="modal-footer">
                        <button @click="submitAddForm" class="btn btn-success">Save changes</button>
                        <button class="btn btn-secondary" @click="closeAddForm">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End of Add Author Modal -->

        <!-- Update Author Modal -->
        <div id="updateAuthorModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Author Details</h5>
                        <button type="button" @click="closeUpdateForm" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger" role="alert" v-if="error !== ''">
                            {{ error }}
                        </div>
                        <v-form ref="updateForm">
                            <v-row>
                                <v-col cols="12" md="6" >
                                    <v-text-field clearable v-model="form.fname" label="First name" required ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" >
                                    <v-text-field clearable v-model="form.lname"  label="Last name" required ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12" >
                                    <v-text-field clearable v-model="form.description" label="Description" required ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </div>
                    <div class="modal-footer">
                        <button @click="submitUpdateForm" class="btn btn-success">Save changes</button>
                        <button class="btn btn-secondary" @click="closeUpdateForm">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End of Update Author Modal -->

    </div>
</template>

<script>
export default {
    middleware: 'guess',

    data() {
        return {
            headers: {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + this.$store.state.authUser.token
                }
            },
            form: {
                id: '',
                fname: '',
                lname: '',
                description: ''
            },
            authors: [],
            error: [],
        }
    },
    mounted() {
        this.getAuthors();
    },
    methods: {
        async getAuthors() {
            this.authors = (await this.$axios.$get(this.$store.state.url + '/authors', this.headers)).data
        },
        async submitAddForm() {
            try {
                this.authors.push((await this.$axios.$post(this.$store.state.url + '/authors', this.form, this.headers)).data)
                this.closeAddForm()
            } catch (error) { if (error.response && error.response.status === 401 || error.response.status === 404) {
                this.error = error.response.data.data
            }}
        },
        async submitUpdateForm() {
            try {
                await this.$axios.$put(this.$store.state.url + '/authors/' + this.form.id, this.form, this.headers)
                this.getAuthors();
                this.closeUpdateForm()
            } catch (error) { if (error.response && error.response.status === 401 || error.response.status === 404) {
                this.error = error.response.data.data
            }}
        },
        async deleteAuthor(index) {
            try {
                await this.$axios.$delete(this.$store.state.url + '/authors/' + this.authors[index].id, this.headers)
                this.authors.splice(index, 1);
            } catch (error) { if (error.response && error.response.status === 401 || error.response.status === 404) {
                this.error = error.response.data.data
            }}
        },
        showAddForm() {
            this.clearFields()
            $('#addAuthorModal').show()
        },
        closeAddForm() {
            $('#addAuthorModal').hide()
            this.clearFields()
        },
        showEditForm(index) {
            this.form = { ...this.authors[index] };
            $('#updateAuthorModal').show()
        },
        closeUpdateForm() {
            $('#updateAuthorModal').hide()
            this.clearFields()
        },
        clearFields() {
            this.form.id = '',
            this.form.fname = '',
            this.form.lname = '',
            this.form.description = '',      
            this.error = ''            
        }
    }
}
</script>
