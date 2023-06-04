import * as React from 'react';

const list = [
    {
        title: 'React',
        url: 'https://reactjs.org/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0
    },
    {
        title: 'Redux',
        url: 'https://redus.js.org/',
        author: 'Dan Abramov, Adrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1
    }
];

const App = () => {

    return (
        <div>
            <h1>My Hacker Stories</h1>

            <Search />

            <hr />

            <List />

        </div>
    );
}

const Search = () => (
    <>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" />
    </>
);

const List = () => (
    <ul>
        {list.map((item) => {
            return (
                <li key={item.objectID}>
                    <span>
                        <a href={item.url}>
                            {item.title}
                        </a>
                    </span><br />
                    <span>{item.author}</span><br />
                    <span>{item.num_comments}</span><br />
                    <span>{item.points}</span>
                </li>
            );
        })}
    </ul>
);

export default App;
