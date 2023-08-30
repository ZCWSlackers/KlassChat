package rocks.zipcode.klasschat.service.mapper;

import org.mapstruct.*;
import rocks.zipcode.klasschat.domain.User;
import rocks.zipcode.klasschat.domain.UserProfile;
import rocks.zipcode.klasschat.service.dto.UserDTO;
import rocks.zipcode.klasschat.service.dto.UserProfileDTO;

/**
 * Mapper for the entity {@link UserProfile} and its DTO {@link UserProfileDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserProfileMapper extends EntityMapper<UserProfileDTO, UserProfile> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    UserProfileDTO toDto(UserProfile s);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);
}
