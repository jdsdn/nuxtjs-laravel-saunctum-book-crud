<template>
    <div class="container"><br>
        <div class="card-header">
            Book Management
            <div class="navbar-end">
                <button @click="showAddForm" class="btn btn-success">Add Book</button>
            </div>
        </div><br>
        <div class="card card-default">
            <div class="table">
                <table id="cartstable" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Publisher</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(book, index) in books" :key="book.id">
                            <td>{{ book.id }}</td>
                            <td>{{ book.title }}</td>
                            <td>{{ book.author_full_name }}</td>
                            <td>{{ book.isbn }}</td>
                            <td>{{ book.publisher }}</td>
                            <td>
                                <button class="btn btn-info btn-sm" @click="showEditForm(index)">
                                    Edit
                                </button>
                                <button class="btn btn-danger btn-sm" @click="deleteBook(index)">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add Book Modal -->
        <div id="addBookModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Enter Book Details</h5>
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
                                    <v-text-field clearable v-model="form.title" label="Title" required ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" >
                                    <v-text-field clearable v-model="form.isbn"  label="isbn" required ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12" >
                                    <v-text-field clearable v-model="form.publisher" label="publisher" required ></v-text-field>
                                </v-col>
                                <div class="form-group col-md-12">
                                  <label for="select">Select Author</label>
                                  <select v-model="form.author_id" v-if="authors != ''" class="form-control">
                                    <option v-for="author in authors" :key="author.id" v-bind:value="author.id"> 
                                      {{ author.fname }} {{ author.lname }} 
                                    </option>
                                  </select>
                                </div>
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
        <!-- end of Add Book Modal -->

        <!-- Update Book Modal -->
        <div id="updateBookModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Book Details</h5>
                        <button type="button" @click="closeUpdateForm" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger" role="alert" v-if="error != ''">
                            {{ error }}
                        </div>
                        <v-form>
                            <v-row>
                                <v-col cols="12" md="6" >
                                    <v-text-field clearable v-model="form.title" label="Title" required ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" >
                                    <v-text-field clearable v-model="form.isbn"  label="isbn" required ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12" >
                                    <v-text-field clearable v-model="form.publisher" label="publisher" required ></v-text-field>
                                </v-col>
                                <div class="form-group col-md-12">
                                    <label for="select">Select Author</label>
                                    <select v-model="form.author_id" v-if="authors != ''" class="form-control">
                                        <option :selected="form.author_id == author.id" v-for="author in authors" :key="author.id" v-bind:value="author.id"> 
                                          {{ author.fname }} {{ author.lname }} 
                                        </option>
                                    </select>
                                </div>
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
        <!-- end of Update Book Modal -->

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
                title: '',
                author_id: '',
                isbn: '',
                publisher: ''
            },
            books: [],
            error: [],
            authors: []
        }
    },
    mounted() {
        this.getBooks();
    },
    methods: {
        async getAuthors() {
            this.authors = (await this.$axios.$get(this.$store.state.url + '/authors', this.headers)).data
        },        
        async getBooks() {
            this.books = (await this.$axios.$get(this.$store.state.url + '/books', this.headers)).data
        },
        async submitAddForm() {
            try {
                this.books.push((await this.$axios.$post(this.$store.state.url + '/books', this.form, this.headers)).data)
                this.closeAddForm()
            } catch (error) { if (error.response && error.response.status === 401 || error.response.status === 404) {
                this.error = error.response.data.data
            }}
        },
        async submitUpdateForm() {
            try {
                await this.$axios.$put(this.$store.state.url + '/books/' + this.form.id, this.form, this.headers)
                this.getBooks();
                this.closeUpdateForm()
            } catch (error) { if (error.response && error.response.status === 401 || error.response.status === 404) {
                this.error = error.response.data.data
            }}
        },
        async deleteBook(index) {
            try {
                await this.$axios.$delete(this.$store.state.url + '/books/' + this.books[index].id, this.headers)
                this.books.splice(index, 1);
            } catch (error) { if (error.response && error.response.status === 401 || error.response.status === 404) {
                this.error = error.response.data.data
            }}
        },
        showAddForm() {
            this.clearFields()
            this.getAuthors().then(function() { $('#addBookModal').show() })
        },
        closeAddForm() {
            $('#addBookModal').hide()
            this.clearFields()
        },
        showEditForm(index) {
            this.form = { ...this.books[index] };
            this.getAuthors();
            $('#updateBookModal').show()
        },
        closeUpdateForm() {
            $('#updateBookModal').hide()
            this.clearFields()
        },
        clearFields() {
            this.form.id = '',
            this.form.title = '',
            this.form.author_id = '',
            this.form.isbn = '',
            this.form.publisher = '',
            this.error = '',
            this.authors
        }
    }
}
</script>
