import * as React from 'react';
import axios from 'axios';

import styles from './App.module.css';

const useStorageState = (key, initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
};

const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload
            };
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true
            };
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter(
                    (story) => action.payload.objectID !== story.objectID
                )
            };
        default:
            throw new Error();
    }
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {

    const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

    const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {
            data: [],
            isLoading: false,
            isError: false
        }
    );

    const handleSearchInput = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleSearchSubmit = (e) => {
        setUrl(`${API_ENDPOINT}${searchTerm}`);
        e.preventDefault();
    }

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });

        try {
            const result = await axios.get(url);

            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits
            });
        } catch {
            dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
        }
    }, [url]);


    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = (item) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>

            <SearchForm
                searchTerm={searchTerm}
                onSearchInput={handleSearchInput}
                onSearchSubmit={handleSearchSubmit}
            />

            {stories.isError && <p>Oops, it's my bad...</p>}

            {stories.isLoading ? (
                <p>Loading...</p>
            ) : (
                <List list={stories.data} onRemoveItem={handleRemoveStory} />
            )}

        </div>
    );
}

const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit
}) => (
    <form onSubmit={onSearchSubmit} className={styles.searchForm}>
        <InputWithLabel
            id="search"
            value={searchTerm}
            isFocused
            onInputChange={onSearchInput}
        >
            <strong>Search:</strong>
        </InputWithLabel>

        <button
            type="submit"
            disabled={!searchTerm}
            className={`${styles.button} ${styles.button_large}`}
        >
            Submit
        </button>
    </form>
);

const InputWithLabel = ({
    id,
    value,
    type = 'text',
    onInputChange,
    isFocused,
    children
}) => {
    // A
    const inputRef = React.useRef();
    // C
    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            // D
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id} className={styles.label}>
                {children}
            </label>
            &nbsp;
            {/* B */}
            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value}
                autoFocus={isFocused}
                onChange={onInputChange}
                className={styles.input}
            />
        </>
    );
}

const List = ({ list, onRemoveItem }) => (
    <ul>
        {list.map((item) => (
            <Item
                key={item.objectID}
                item={item}
                onRemoveItem={onRemoveItem}
            />
        ))}
    </ul>
);


const Item = ({ item, onRemoveItem }) => {
    return (
        <li className={styles.item}>
            <span style={{ width: "40%" }}>
                <a href={item.url} target="_blank" rel="noreferrer">
                    {item.title}
                </a>
            </span>
            <span style={{ width: "30%" }}>{item.author}</span>
            <span style={{ width: "10%" }}>{item.num_comments}</span>
            <span style={{ width: "10%" }}>{item.points}</span>
            <span>
                <button
                    type="button"
                    onClick={() => onRemoveItem(item)}
                    className={`${styles.button} ${styles.button_small}`}
                >
                    Dismiss
                </button>
            </span>
        </li>
    );
}

export default App;
