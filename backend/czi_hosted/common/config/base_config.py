import copy

from flatten_dict import flatten
from backend.common.errors import ConfigurationError


class BaseConfig(object):
    """
    This class handles the mechanics of updating and checking attributes.
    Derived classes are expected to store the actual attributes
    Currently DatasetConfig and ServerConfig both inherit from BaseConfig.
    """

    def __init__(self, app_config, default_config, dictval_cases={}):
        # reference back to the app_config
        self.app_config = app_config
        # the complete set of attributes and their default values (unflattened)
        self.default_config = default_config
        # attributes where the value may be a dict (and therefore are not flattened)
        self.dictval_cases = dictval_cases
        # used to make sure every attribute value is checked
        self.attr_checked = {key_name: False for key_name in self.create_mapping(default_config).keys()}

    def create_mapping(self, config):
        """
        Create a dictionary where the keys are the name of attributes (using double underscore convention)
        For example: authentication__type

        The values are a tuple,
        - the first item of the tuple is a tuple of path elements (location in config 'tree')
        - the second item is the value of the config parameter

        For example: (('authentication', 'type'), 'session'))
        """
        config_copy = copy.deepcopy(config)
        mapping = {}

        # special cases where the value could be a dict.
        # If its value is not None, the entry is added to the mapping, and not included
        # in the flattening below.
        for dictval_case in self.dictval_cases:
            cur = config_copy
            for part in dictval_case[:-1]:
                cur = cur.get(part, {})
            val = cur.get(dictval_case[-1])
            if val is not None:
                key = "__".join(dictval_case)
                mapping[key] = (dictval_case, val)
                del cur[dictval_case[-1]]

        flat_config = flatten(config_copy)
        for key, value in flat_config.items():
            # name of the attribute
            attr = "__".join(key)
            mapping[attr] = (key, value)

        return mapping

    def validate_correct_type_of_configuration_attribute(self, attrname, vtype):
        val = getattr(self, attrname)
        if type(vtype) in (list, tuple):
            if type(val) not in vtype:
                tnames = ",".join([x.__name__ for x in vtype])
                raise ConfigurationError(
                    f"Invalid type for attribute: {attrname}, expected types ({tnames}), got {type(val).__name__}"
                )
        else:
            if type(val) != vtype:
                raise ConfigurationError(
                    f"Invalid type for attribute: {attrname}, "
                    f"expected type {vtype.__name__}, got {type(val).__name__}"
                )

        self.attr_checked[attrname] = True

    def check_config(self):
        mapping = self.create_mapping(self.default_config)
        for key in mapping.keys():
            if not self.attr_checked[key]:
                raise ConfigurationError(f"The attr '{key}' has not been checked")

    def update(self, **kw):
        """Update the attributes defined in kw with their new values."""
        for key, value in kw.items():
            if not hasattr(self, key):

                # check if the key is setting into a dictval entry.
                found_dictval = False
                for dictval in self.dictval_cases:
                    dictvalname = "__".join(dictval)
                    if dictvalname + "__" in key:
                        dictkey = key[len(dictvalname) + 2 :]
                        curdictval = getattr(self, dictvalname)
                        if curdictval is None:
                            setattr(self, dictvalname, dict(dictkey=value))
                        else:
                            curdictval[dictkey] = value

                        found_dictval = True
                        break

                if found_dictval:
                    continue
                raise ConfigurationError(f"unknown config parameter {key}.")
            try:
                if type(value) == tuple:
                    # convert tuple values to list values
                    value = list(value)
                setattr(self, key, value)
            except KeyError:
                raise ConfigurationError(f"Unable to set config parameter {key}.")

            self.attr_checked[key] = False

    def update_from_config(self, config, prefix):
        mapping = self.create_mapping(config)
        for attr, (key, value) in mapping.items():
            if not hasattr(self, attr):
                raise ConfigurationError(f"Unknown key from config file: {prefix}__{attr}")
            setattr(self, attr, value)

            self.attr_checked[attr] = False

    def changes_from_default(self):
        """Return all the attribute that are different from the default"""
        mapping = self.create_mapping(self.default_config)
        diff = []
        for attrname, (key, defval) in mapping.items():
            curval = getattr(self, attrname)
            if curval != defval:
                diff.append((attrname, curval, defval))
        return diff
