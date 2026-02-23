const Header = ({children = null, title, buttons}) => {
	return (
		<div className="native-custom-fields-app-header">
			{children ? children : (
				<>
					<h2 className="native-custom-fields-app-header-title">{title}</h2>
					{buttons && (
						<div className="native-custom-fields-app-header-buttons">
							{buttons}
						</div>
					)}
				</>
			)}
		</div>
	)
}

export default Header;
