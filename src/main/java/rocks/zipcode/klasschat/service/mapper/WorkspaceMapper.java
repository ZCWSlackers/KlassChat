package rocks.zipcode.klasschat.service.mapper;

import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;
import rocks.zipcode.klasschat.domain.User;
import rocks.zipcode.klasschat.domain.Workspace;
import rocks.zipcode.klasschat.service.dto.UserDTO;
import rocks.zipcode.klasschat.service.dto.WorkspaceDTO;

/**
 * Mapper for the entity {@link Workspace} and its DTO {@link WorkspaceDTO}.
 */
@Mapper(componentModel = "spring")
public interface WorkspaceMapper extends EntityMapper<WorkspaceDTO, Workspace> {
    @Mapping(target = "users", source = "users", qualifiedByName = "userIdSet")
    WorkspaceDTO toDto(Workspace s);

    @Mapping(target = "removeUser", ignore = true)
    Workspace toEntity(WorkspaceDTO workspaceDTO);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("userIdSet")
    default Set<UserDTO> toDtoUserIdSet(Set<User> user) {
        return user.stream().map(this::toDtoUserId).collect(Collectors.toSet());
    }
}
