from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in hajj_management_system/__init__.py
from hajj_management_system import __version__ as version

setup(
	name="hajj_management_system",
	version=version,
	description="System for Management Hajj in KSA",
	author="omar@havalx.com",
	author_email="omar@havalx.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
