import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface User {
  id: number
  name: string
  username: string
  email: string
}

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

const createPost = async (newPost: Omit<Post, 'id'>): Promise<Post> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(newPost),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  if (!response.ok) {
    throw new Error('Failed to create post')
  }
  return response.json()
}

function App() {
  const queryClient = useQueryClient()

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleCreatePost = () => {
    createPostMutation.mutate({
      title: 'New Post from TanStack Query',
      body: 'This post was created using TanStack Query mutations!',
      userId: 1,
    })
  }

  if (usersLoading || postsLoading) {
    return <div className="loading">Loading...</div>
  }

  if (usersError || postsError) {
    return (
      <div className="error">
        Error: {(usersError || postsError)?.message}
      </div>
    )
  }

  return (
    <div className="container">
      <h1>TanStack Query Demo</h1>
      
      <div className="card">
        <h2>Users ({users?.length})</h2>
        <div className="user-list">
          {users?.slice(0, 6).map((user) => (
            <div key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p>@{user.username}</p>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Posts ({posts?.length})</h2>
        <button
          onClick={handleCreatePost}
          disabled={createPostMutation.isPending}
        >
          {createPostMutation.isPending ? 'Creating...' : 'Create New Post'}
        </button>
        {createPostMutation.isError && (
          <div className="error">
            Error creating post: {createPostMutation.error?.message}
          </div>
        )}
        {createPostMutation.isSuccess && (
          <div style={{ color: 'green', margin: '1rem 0' }}>
            Post created successfully!
          </div>
        )}
        <div>
          {posts?.slice(0, 5).map((post) => (
            <div key={post.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee' }}>
              <h4>{post.title}</h4>
              <p>{post.body}</p>
              <small>By User #{post.userId}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App