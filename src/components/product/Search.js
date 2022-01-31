
import Search from '../icons/Search'
export default function SearcForm( {searchQuery, setSearchQuery, handleSearchFormSubmit}) {
    return (
        <form className="form form--search" noValidate onSubmit={handleSearchFormSubmit}>
            <input type="search" name="search" placeholder="Cerca per nome" value={searchQuery}
          onChange={( event ) => setSearchQuery( event.target.value )} />
            <button>
                <Search />
            </button>
        </form>
    )
}